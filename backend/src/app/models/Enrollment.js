import { DataTypes, Model } from 'sequelize';

class Enrollment extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: DataTypes.INTEGER,
        plan_id: DataTypes.INTEGER,
        start_date: DataTypes.DATE,
        end_date: DataTypes.DATE,
        price: DataTypes.DECIMAL,
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
    this.belongsTo(models.Plan, { foreignKey: 'plan_id', as: 'plan' });
  }
}

export default Enrollment;
