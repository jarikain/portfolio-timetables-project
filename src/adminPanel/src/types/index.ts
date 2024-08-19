export interface Device {
  id?: number,
  ip: string,
  location: Location | null
}

export interface Location {
  id?: number
  name: string
  city: string
  update_interval: number
  views: View[]
  theme: "LAB" | "LUT"
}

export interface View {
  id?: number
  type: 'train' | 'bus' | 'info'
  content: string | null
  stops: Stop[]
  enabled: boolean
}

export interface Stop {
  id?: number
  title: string
  trips: number
  stop_api_id: string
  stop_name: string | null
}

export interface AdminUser {
  id?: number
  username: string
  password: string
}