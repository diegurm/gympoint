import * as Yup from 'yup';

import Student from '../models/Student';
import HelpOrder from '../models/HelpOrder';

class HelpOrderController {
  async store(req, res) {
    const { id } = req.params;

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(400).json({ error: 'Student does not exist' });
    }
    const schema = Yup.object().shape({
      question: Yup.string().required('Question is required'),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { question } = req.body;

    const helpOrder = await HelpOrder.create({
      student_id: id,
      question,
    });

    return res.json(helpOrder);
  }
}

export default new HelpOrderController();
