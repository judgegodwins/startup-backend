/* eslint-disable @typescript-eslint/ban-types, func-names */
import {
  registerDecorator,
  ValidationOptions,
  isEmail,
  isString,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Transform } from 'class-transformer';
import parsePhoneNumber from 'libphonenumber-js';

export function IsEmail(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isEmail',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          return isEmail(value) && !value.includes('+');
        },
        defaultMessage() {
          return 'Please enter a valid email address';
        },
      },
    });
  };
}

export function IsPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPhoneNumber',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          this.defaultMessage = () => 'Please enter a valid phone number';
          if (!isString(value)) {
            this.defaultMessage = () => 'Phone number is required';
            return false;
          }

          const parsedPhoneNumber = parsePhoneNumber(value);
          if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
            return false;
          }

          if (!parsedPhoneNumber.country) {
            this.defaultMessage = () => 'Phone number should be in international format';
            return false;
          }

          return true;
        },
      } as ValidatorConstraintInterface,
    });
  };
}

export function IsDependentOn<T>(property: string, basedOn: T, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDependentOn',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return Boolean(relatedValue) && relatedValue === basedOn ? Boolean(value) : true;
        },
      },
    });
  };
}

export const TransformToLowerCase = (): PropertyDecorator => {
  return Transform(({ value }) => (value ? (value as string).toLowerCase() : undefined));
};

export const TransformToUpperCase = (): PropertyDecorator => {
  return Transform(({ value }) => (value ? (value as string).toUpperCase() : undefined));
};

export const TransformTrim = (): PropertyDecorator => {
  return Transform(({ value }) => (value ? (value as string).trim() : undefined));
};
