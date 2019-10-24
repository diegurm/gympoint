import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required('Name is required'),
      email: Yup.string().required('Email is required'),
      age: Yup.number()
        .typeError('Age must be a number')
        .positive('Age must be greater than zero')
        .required('Age is required'),
      wheigth: Yup.number()
        .positive('Wheigth must be greater than zero')
        .required('Wheigth is required'),
      height: Yup.number()
        .positive('Heigth must be greater than zero')
        .required('Heigth is required'),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });
    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists' });
    }

    const student = await Student.create(req.body);
    return res.json({ student });
  }
}

export default new StudentController();
