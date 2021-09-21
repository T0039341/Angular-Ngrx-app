export class Tank {
  tank_id: string;
  name: string;
  shape: string;
  length: number;
  width: number;
  height: number;
  diameter: number;
  volume: number;
  sensor: Sensor;
  filled_volume: number;
}

export class Sensor {
  sensor_id: string;
  sim_number: string;
  apn: string;
  apn_username: string;
  apn_password: string;
  logger_speed: number;
  update_frequency: number;
  is_verified: boolean;
  temperature: number;
  expires_at: Date;
  battery_percentage: number;
}
