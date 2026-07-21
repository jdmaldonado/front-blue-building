export const DoorType = {
  Public: 'PUBLIC',
  Private: 'PRIVATE',
  Reserved: 'RESERVED',
} as const;
export type DoorType = (typeof DoorType)[keyof typeof DoorType];

// The API uses HTTP-like numeric codes for door actions.
export const DoorAction = {
  Open: 200,
  Close: 201,
} as const;
export type DoorAction = (typeof DoorAction)[keyof typeof DoorAction];

export const UserEvent = {
  Mute: 'MUTE',
  Intrusion: 'INTRUSION',
  Emergency: 'EMERGENCY',
} as const;
export type UserEvent = (typeof UserEvent)[keyof typeof UserEvent];
