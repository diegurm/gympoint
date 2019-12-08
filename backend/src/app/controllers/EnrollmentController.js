import * as Yup from 'yup';
import { format, parseISO, addDays, isPast } from 'date-fns';

import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';
import Student from '../models/Student';
import Mail from '../../lib/Mail';

class EnrollmentController {
  async index(req, res) {
    const enrollments = await Enrollment.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });
    res.json(enrollments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required('Student is required'),
      plan_id: Yup.number().required('Plan is required'),
      start_date: Yup.date().required('Start date is required'),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { student_id, plan_id, start_date } = req.body;

    if (isPast(parseISO(start_date))) {
      return res.status(400).json({ error: 'Start date has passed' });
    }

    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exist' });
    }

    const end_date = addDays(parseISO(start_date), plan.duration * 30);
    const price = plan.price * plan.duration;

    // Validate enrollment
    // Validar se a data de inicio coincide com algum periodo ja selecionado anteriormente
    const enrollmentIsValid = await Enrollment.findOne({
      where: { student_id },
      order: [['end_date', 'DESC']],
    });
    if (enrollmentIsValid) {
      if (parseISO(start_date) < enrollmentIsValid.end_date) {
        return res
          .status(400)
          .json({ error: 'Enrollment already exists for selected period' });
      }
    }

    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matrícula Gympoint',
      text: 'Sua matrícula foi finalizada com sucesso',
      template: 'wellcome',
      context: {
        student: student.name,
        start_date: format(new Date(start_date), "dd'/'MM'/'yyyy"),
        end_date: format(new Date(end_date), "dd'/'MM'/'yyyy"),
        price: price.toFixed(2),
        plan: plan.title,
      },
    });

    return res.json(enrollment);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required('Student is required'),
      plan_id: Yup.number().required('Plan is required'),
      start_date: Yup.date().required('Start date is required'),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { id } = req.params;
    const { student_id, plan_id, start_date } = req.body;

    if (isPast(parseISO(start_date))) {
      return res.status(400).json({ error: 'Start date has passed' });
    }

    const enrollment = await Enrollment.findByPk(id);
    if (!enrollment) {
      return res.status(400).json({ error: 'Enrollment not found' });
    }

    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exist' });
    }
    const end_date =
      start_date != enrollment.start_date
        ? addDays(parseISO(start_date), plan.duration * 30)
        : enrollment.start_date;
    const price =
      end_date != enrollment.end_date
        ? plan.price * plan.duration
        : enrollment.price;

    // Validate enrollment
    // Validar se a data de inicio coincide com algum periodo ja selecionado anteriormente
    const enrollmentIsValid = await Enrollment.findOne({
      where: { student_id },
      order: [['end_date', 'DESC']],
    });
    if (enrollmentIsValid && enrollmentIsValid.id !== id) {
      if (parseISO(start_date) < enrollmentIsValid.end_date) {
        return res
          .status(400)
          .json({ error: 'Enrollment already exists for selected period' });
      }
    }
    await enrollment.update({
      ...req.body,
      end_date,
      price,
    });

    return res.json(enrollment);
  }

  async delete(req, res) {
    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment) {
      return res.status(400).send({ error: 'Enrollment not found' });
    }

    await enrollment.destroy();

    return res.status(204).send();
  }
}

export default new EnrollmentController();
