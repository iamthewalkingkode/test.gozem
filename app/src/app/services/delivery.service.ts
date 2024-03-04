import { Injectable } from '@angular/core';
import { helpers, models } from '../../utils';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  private baseUrl = `${helpers.apiBaseURL}/api`;

  constructor() { }

  async all() {
    try {
      const res = await fetch(`${this.baseUrl}/delivery`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      const data = await res.json();
      return {
        meta: data.meta as models.Meta,
        data: data.data as models.Delivery[],
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async create(payload: Partial<models.Delivery>) {
    try {
      const res = await fetch(`${this.baseUrl}/delivery`, {
        body: JSON.stringify(payload),
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      const data = await res.json();
      return data as models.Delivery | string[];
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async update(package_id: string, payload: Partial<models.Delivery>) {
    try {
      const res = await fetch(`${this.baseUrl}/delivery/${package_id}`, {
        body: JSON.stringify(payload),
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      const data = await res.json();
      return data as models.Delivery | string[];
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async get(package_id: string) {
    try {
      const res = await fetch(`${this.baseUrl}/delivery/${package_id}`, {
        method: 'GET',
      });
      const data = await res.json();
      return data as models.Delivery;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async delete(package_id: string) {
    try {
      const res = await fetch(`${this.baseUrl}/delivery/${package_id}`, {
        method: 'DELETE',
      });
      return await res.json();
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
