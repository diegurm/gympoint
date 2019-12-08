import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async store(req, res) {
    const { id } = req.params;

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(400).json({ error: 'Student does not exist' });
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
