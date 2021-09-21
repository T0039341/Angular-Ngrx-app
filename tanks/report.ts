export class Report {
  mode: string;
  tank_id: string;
  volume: number;
  volume_cosumed: number;
  volume_filled: number;
  average_volume_consumed: number;
  created_at: string;
  events: [Event];
  measurements: [Measurement];
}

export class Event {
  volume_changed: number;
  created_at: string;
}

export class Measurement {
  rssi: number;
  src: number;
  volume: number;
  temperature: number;
  bund_leak: boolean;
  created_at:string;
}
