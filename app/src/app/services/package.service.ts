import { Injectable } from '@angular/core';
import { helpers, models } from '../../utils';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  
  private baseUrl = `${helpers.apiBaseURL}/api`;

  constructor() { }

  async all() {
    try {
      const res = await fetch(`${this.baseUrl}/package`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      const data = await res.json();
      return {
        meta: data.meta as models.Meta,
        data: data.data as models.Package[],
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async create(payload: Partial<models.Package>) {
    try {
      const res = await fetch(`${this.baseUrl}/package`, {
        body: JSON.stringify(payload),
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      const data = await res.json();
      return data as models.Package;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async update(payload: Partial<models.Package>) {
    try {
      const res = await fetch(`${this.baseUrl}/package/${payload.package_id}`, {
        body: JSON.stringify(payload),
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      const data = await res.json();
      return data as models.Package;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async get(package_id: string) {
    try {
      const res = await fetch(`${this.baseUrl}/package/${package_id}`, {
        method: 'GET',
      });
      const data = await res.json();
      return data as models.Package;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async delete(package_id: string) {
    try {
      const res = await fetch(`${this.baseUrl}/package/${package_id}`, {
        method: 'DELETE',
      });
      return await res.json();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

}
