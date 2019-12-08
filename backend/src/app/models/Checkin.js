import { DataTypes, Model } from 'sequelize';

class Checkin extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: DataTypes.INTEGER,
      },
      { sequelize },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, {
      foreignKey: 'student_id',
      as: 'student',
    });
  }
}

export default Checkin;
