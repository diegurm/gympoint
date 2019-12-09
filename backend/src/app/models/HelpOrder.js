import { DataTypes, Model } from 'sequelize';

class HelpOrder extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: DataTypes.INTEGER,
        answer: DataTypes.STRING,
        question: DataTypes.STRING,
        answer_at: DataTypes.DATE,
      },
      { sequelize },
    );
  }

  static associate(models) {
    this.belongsTo(models.Student, {
      foreignKey: 'student_id',
      as: 'student',
    });
  }
}

export default HelpOrder;
