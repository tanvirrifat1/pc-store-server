import { model, Schema } from 'mongoose';
import { TStudent, StudentModel, TUserName } from './student.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

// const userNameSchema = new Schema<UserName>({
//   firstName: {
//     type: String,
//     trim: true,
//     maxlength: [20, 'Max allowed length is 20'],
//     required: [true, 'must be need to firstName'],
//     // validate: {
//     //   validator: isCapitalized,
//     //   message: '{VALUE} is not capitalized format',
//     // },
//   },
//   middleName: { type: String, trim: true },
//   lastName: {
//     type: String,
//     required: true,
//     trim: true,
//     // validate: {
//     //   validator: (value: string) => validator.isAlpha(value),
//     //   message: '{VALUE} is not valid',
//     // },
//   },
// });

// const userGuardian = {
//   fatherName: { type: String, trim: true, required: true },
//   motherName: { type: String, trim: true, required: true },
// };

// const studentSchema = new Schema<Student>({
//   id: { type: String, trim: true, required: true, unique: true },
//   name: {
//     type: userNameSchema,
//     required: true,
//   },
//   email: {
//     type: String,
//     trim: true,
//     required: true,
//     unique: true,
//     // validate: {
//     //   validator: (value: string) => validator.isEmail(value),
//     //   message: '{VALUE} is not valid',
//     // },
//   },
//   gender: {
//     type: String,
//     enum: {
//       values: ['male', 'female', 'other'],
//       message: '{VALUE} is not valid',
//     },
//     required: true,
//   },
//   bloodGroup: {
//     type: String,
//     enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
//   },
//   contactNo: { type: String, trim: true, required: true },
//   dateOfBirth: { type: String, trim: true },
//   emergencyContactNo: { type: String, trim: true, required: true },
//   guardian: userGuardian,
//   presentAddress: { type: String, trim: true, required: true },
//   permanentAddress: { type: String, trim: true, required: true },
//   profileImage: { type: String, trim: true },
//   isActive: {
//     type: String,
//     enum: ['active', 'blocked'],
//     default: 'active',
//   },
// });

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    trim: true,
    required: true,
  },
  middleName: { type: String, trim: true },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
});

const userGuardian = {
  fatherName: { type: String, trim: true, required: true },
  motherName: { type: String, trim: true, required: true },
};

const studentSchema = new Schema<TStudent, StudentModel>({
  id: {
    type: String,
    trim: true,
    required: [true, 'Id is required!'],
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    required: [true, 'password is required!'],
    maxlength: [20, 'password cannot be more then 20 character'],
  },
  name: {
    type: userNameSchema,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message: '{VALUE} is not valid',
    },
    required: true,
  },
  bloodGroup: {
    type: String,
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      message: '{VALUE} is not valid',
    },
  },
  contactNo: { type: String, trim: true, required: true },
  dateOfBirth: { type: String, trim: true },
  emergencyContactNo: { type: String, trim: true, required: true },
  guardian: userGuardian,
  presentAddress: { type: String, trim: true, required: true },
  permanentAddress: { type: String, trim: true, required: true },
  profileImage: { type: String, trim: true },
  isActive: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// pre save middleware

studentSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const bcUser = this;
  bcUser.password = await bcrypt.hash(
    bcUser.password,
    Number(config.bcrypt_Salt_rounds),
  );
  next();
});

// pre save middleware
studentSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// query middleware

studentSchema.pre('find', async function (next) {
  console.log(this);
  next();
});

//creating a custom static method

studentSchema.statics.isUserExists = async function (id: string) {
  const UserExist = await Student.findOne({ id });
  return UserExist;
};

// creating a custom instance method
// studentSchema.methods.isUserExist = async function (id: string) {
//   const existUser = await Student.findOne({ id });
//   return existUser;
// };

export const Student = model<TStudent, StudentModel>('student', studentSchema);
