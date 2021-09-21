import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Tank } from './tank';
import { ApiResponse } from '../shared/api-response';
import { Observable } from 'rxjs';
import { paged_results } from './paged-results';
import { ActivatedRoute } from '@angular/router';
import { Report } from './report';
import { Empty } from '../user/empty';
import { MessageService } from '../shared/message.service';

@Injectable({
  providedIn: 'root'
})
export class TankService {
  httpOptions = {
    headers: new HttpHeaders({ 'content-Type': 'application/json' })
  };
  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  register(tank: Tank): Observable<ApiResponse<Tank>> {
    const body = {
      name: tank.name,
      shape: tank.shape,
      length: tank.length,
      width: tank.width,
      height: tank.height,
      diameter: tank.diameter,
      sensor: {
        sensor_id: tank.sensor.sensor_id,
        sim_number: tank.sensor.sim_number,
        apn: tank.sensor.apn,
        apn_username: tank.sensor.apn_username,
        apn_password: tank.sensor.apn_password,
        logger_speed: tank.sensor.logger_speed,
        update_frequency: tank.sensor.update_frequency
      }
    };
    console.log(body);
    const result = this.httpClient.post<ApiResponse<Tank>>(
      '/tanks',
      body,
      this.httpOptions
    );
    return result;
  }

  getTanks(
    page: number = 1,
    pageSize: number
  ): Observable<ApiResponse<paged_results<Tank>>> {
    const result = this.httpClient.get<ApiResponse<paged_results<Tank>>>(
      `/tanks?page=${page}&page_size=${pageSize}`
    );

    console.log(result);
    return result;
  }

  getTankById(id: string): Observable<ApiResponse<Tank>> {
    const result = this.httpClient.get<ApiResponse<Tank>>('/tanks/' + id);
    console.log(result);
    return result;
  }

  deleteTank(id: string): Observable<ApiResponse<Empty>> {
    const result = this.httpClient.delete<ApiResponse<Empty>>('/tanks/' + id);
    console.log('works', result);
    return result;
  }

  editTank(tank: Tank): Observable<ApiResponse<Tank>> {
    const id: string = tank.tank_id;
    const body = {
      name: tank.name,
      shape: tank.shape,
      length: tank.length,
      width: tank.width,
      height: tank.height,
      diameter: tank.diameter,
      sensor: {
        sensor_id: tank.sensor.sensor_id,
        sim_number: tank.sensor.sim_number,
        apn: tank.sensor.apn,
        apn_username: tank.sensor.apn_username,
        apn_password: tank.sensor.apn_password,
        logger_speed: tank.sensor.logger_speed,
        update_frequency: tank.sensor.update_frequency
      }
    };
    console.log(body);
    const result = this.httpClient.put<ApiResponse<Tank>>(
      '/tanks/' + id,
      body,
      this.httpOptions
    );
    return result;
  }

  verifyTank(id: string): Observable<ApiResponse<Tank>> {
    const result = this.httpClient.post<ApiResponse<Tank>>(
      '/tanks/' + id + '/config',
      this.httpOptions
    );
    console.log(result);
    return result;
  }

  getVerifiedTank(id: string) {
    const result = this.httpClient.get<ApiResponse<Tank>>('/tanks/' + id);
    console.log(result);
    return result;
  }

  // TODO: Add mode query param in here
  // TODO: append the new query params from user in the component
  getReports(
    tankId: string,
    mode: string,
    page: number = 1,
    pageSize: number = 1
  ) {
    const results = this.httpClient.get<ApiResponse<paged_results<Report>>>(
      `/reports?tank_id=${tankId}&mode=${mode}&page=${page}&page_size=${pageSize}`
    );
    console.log(results);
    return results;
  }
}
