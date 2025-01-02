export type GymDetailsResponse = {
  name: string;
  description: string;
  location: string;
  number: string;
  image: string;
  plans: Plan[];
  routines: Routine[];
};
type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  img: string;
};
type Routine = {
  id: string;
  name: string;
  description: string;
  img: string;
};
