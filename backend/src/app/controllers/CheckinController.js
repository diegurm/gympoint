import { startOfWeek, endOfWeek } from 'date-fns';
import { Op } from 'sequelize';

import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const { id } = req.params;

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    const checkins = await Checkin.findAll({
      where: {
        student_id: id,
      },
      attributes: ['created_at'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.json(checkins);
  }

  async store(req, res) {
    const { id } = req.params;

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    const checkinsThisDay = await Checkin.findAll({
      where: {
        student_id: id,
        created_at: new Date(),
      },
    });

    if (checkinsThisDay) {
      return res
        .status(400)
        .json({ error: 'Exceeded check in limit this day' });
    }

    const startDateOfWeek = startOfWeek(new Date());
    const endDateOfWeek = endOfWeek(new Date());

    const checkinsThisWeek = await Checkin.findAll({
      where: {
        student_id: id,
        createdAt: {
          [Op.between]: [startDateOfWeek, endDateOfWeek],
        },
      },
    });

    if (checkinsThisWeek.length > 5) {
      return res
        .status(400)
        .json({ error: 'Exceeded check in limit this week' });
    }

    const checkin = await Checkin.create({
      student_id: id,
    });

    return res.json({
      id: checkin.id,
      student,
      created_at: checkin.createdAt,
    });
  }
}

export default new CheckinController();
