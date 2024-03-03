import express from 'express';
import config from '@/config';
import { types } from './index';
import getUuid from 'uuid-by-string';
import latinize from 'latinize';
import logger from '@/middlewares/logger.middleware';

/**
 *
 * @param length number
 * @param strength string[] a: alphabets, n: numbers, s: alphabets
 * @return string
 */
export const randomCode = (length: number = 6, strength: string[] = ['n']) => {
  var result = '';
  var characters = '';
  if (strength.includes('a')) {
    characters += 'qwertyuplkjhgfdsazxcvbnmMNBVCXZASDFGHJKLPUYTREWQ';
  }
  if (strength.includes('n')) {
    characters += '0123456789';
  }
  if (strength.includes('s')) {
    characters += '9@,!%#[{]}=():?';
  }
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


export const numberFormat = (number: number, decimal = 2) => {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: decimal }).format(number);
}

export const isJson = (str: any) => {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
}

export const getFileExtension = (filename: string) => {
  var ext = /^.+\.([^.]+)$/.exec(filename);
  return ext === null ? '' : ext[1];
}

export const throwError = (status: types.HttpStatus, message: string) => {
  throw new Error(JSON.stringify({ status, message }));
}

export const catchError = (res: express.Response, error: Error) => {
  if (isJson(error.message)) {
    const e: types.Error = JSON.parse(error.message);
    res.status(e.status).json([e.message]);
  } else {
    logger.error(error.message);
    res.status(types.HttpStatus.InternalServerError).json([
      config.NODE_ENV === 'production' ? 'Uh Oh! Something broke!' : error.message,
    ]);
  }
  return;
}

export const customUuid = (str: string) => getUuid(latinize(str.toLowerCase().split(' ').join('')));

export const regex = {
  date: {
    match: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
    format: 'YYYY-MM-DD HH:mm:ss',
  }
};