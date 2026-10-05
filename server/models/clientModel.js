const mongoose = require('mongoose');

const nameSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true
    },
    lastname: {
      type: String,
      required: [true, 'El apellido es obligatorio'],
      trim: true
    }
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      default: ''
    }
  },
  { _id: false }
);

const clientSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'El correo electrónico es obligatorio'],
      trim: true,
      lowercase: true
    },
    username: {
      type: String,
      required: [true, 'El nombre de usuario es obligatorio'],
      trim: true
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria']
    },
    name: {
      type: nameSchema,
      required: true
    },
    address: {
      type: addressSchema,
      default: () => ({})
    },
    phone: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Mapeo virtual de _id a id para total compatibilidad con el frontend
clientSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  }
});

clientSchema.set('toObject', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  }
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
