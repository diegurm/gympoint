import * as Yup from 'yup';
import { parseISO, addDays } from 'date-fns';

import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';
import Student from '../models/Student';
import Mail from '../../lib/Mail';

class EnrollmentController {
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

    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exist' });
    }
    const end_date = addDays(parseISO(start_date), plan.duration * 30);
    const price = plan.price * plan.duration;

    const student = await Student.findByPk(student_id);

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
      context: { student: student.name },
    });

    return res.json(enrollment);
  }
}

export default new EnrollmentController();
