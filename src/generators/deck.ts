import { Card } from "../types/card";

export const generateDeck = (): Card[] => {
  return [
    { 
      name: 'Great Aspect Flower', 
      color: 'red',
      loose: false,
      nucleus: { particles: { red: 1, green: 0, blue: 0 } }, 
      cells: [
        { level: 0, sector: 0, particle: { color: 'red' } },
        { level: 1, sector: 0, particle: { color: 'red' } },
        { level: 2, sector: 0, particle: { color: 'red' } },
        { level: 0, sector: 11, particle: { color: 'red' } },
        { level: 1, sector: 11, particle: { color: 'red' } },
        { level: 2, sector: 11, particle: { color: 'red' } },
        { level: 0, sector: 3, particle: { color: 'red' } },
        { level: 1, sector: 3, particle: { color: 'red' } },
        { level: 2, sector: 3, particle: { color: 'red' } },
        { level: 0, sector: 4, particle: { color: 'red' } },
        { level: 1, sector: 4, particle: { color: 'red' } },
        { level: 2, sector: 4, particle: { color: 'red' } },    
        { level: 0, sector: 7, particle: { color: 'red' } },
        { level: 1, sector: 7, particle: { color: 'red' } },
        { level: 2, sector: 7, particle: { color: 'red' } },
        { level: 0, sector: 8, particle: { color: 'red' } },
        { level: 1, sector: 8, particle: { color: 'red' } },
        { level: 2, sector: 8, particle: { color: 'red' } },    
      ]
    },
    { 
      name: 'Hollow Aspect Flower',
      color: 'red',
      loose: false,
      nucleus: { particles: { red: 0, green: 0, blue: 0 } },
      cells: [
        { level: 0, sector: 0, particle: { color: 'red' } },
        { level: 1, sector: 0, particle: { color: 'red' } },
        { level: 2, sector: 0, particle: { color: 'red' } },
        { level: 0, sector: 11, particle: { color: 'red' } },
        { level: 1, sector: 11, particle: { color: 'red' } },
        { level: 2, sector: 11, particle: { color: 'red' } },
        { level: 0, sector: 3, particle: { color: 'red' } },
        { level: 1, sector: 3, particle: { color: 'red' } },
        { level: 2, sector: 3, particle: { color: 'red' } },
        { level: 0, sector: 4, particle: { color: 'red' } },
        { level: 1, sector: 4, particle: { color: 'red' } },
        { level: 2, sector: 4, particle: { color: 'red' } },    
        { level: 0, sector: 7, particle: { color: 'red' } },
        { level: 1, sector: 7, particle: { color: 'red' } },
        { level: 2, sector: 7, particle: { color: 'red' } },
        { level: 0, sector: 8, particle: { color: 'red' } },
        { level: 1, sector: 8, particle: { color: 'red' } },
        { level: 2, sector: 8, particle: { color: 'red' } },    
      ]
    },
    { 
      name: 'Pure Aspect Nucleus',
      color: 'red',
      loose: false,
      nucleus: { particles: { red: 1, green: 0, blue: 0 } },
      cells: [] 
    },
    { 
      name: 'Elementary Aspect',
      color: 'red',
      loose: true, 
      nucleus: { particles: { red: 1, green: 0, blue: 0 } }, 
      cells: []
    },
    { 
      name: 'Great Power Flower', 
      color: 'green',
      loose: false, 
      nucleus: { particles: { red: 0, green: 1, blue: 0 } }, 
      cells: [
        { level: 0, sector: 0, particle: { color: 'green' } },
        { level: 1, sector: 0, particle: { color: 'green' } },
        { level: 2, sector: 0, particle: { color: 'green' } },
        { level: 0, sector: 11, particle: { color: 'green' } },
        { level: 1, sector: 11, particle: { color: 'green' } },
        { level: 2, sector: 11, particle: { color: 'green' } },
        { level: 0, sector: 3, particle: { color: 'green' } },
        { level: 1, sector: 3, particle: { color: 'green' } },
        { level: 2, sector: 3, particle: { color: 'green' } },
        { level: 0, sector: 4, particle: { color: 'green' } },
        { level: 1, sector: 4, particle: { color: 'green' } },
        { level: 2, sector: 4, particle: { color: 'green' } },    
        { level: 0, sector: 7, particle: { color: 'green' } },
        { level: 1, sector: 7, particle: { color: 'green' } },
        { level: 2, sector: 7, particle: { color: 'green' } },
        { level: 0, sector: 8, particle: { color: 'green' } },
        { level: 1, sector: 8, particle: { color: 'green' } },
        { level: 2, sector: 8, particle: { color: 'green' } },    
      ]
    },
    { 
      name: 'Hollow Power Flower',
      color: 'green',
      loose: false,
      nucleus: { particles: { red: 0, green: 0, blue: 0 } },
      cells: [
        { level: 0, sector: 0, particle: { color: 'green' } },
        { level: 1, sector: 0, particle: { color: 'green' } },
        { level: 2, sector: 0, particle: { color: 'green' } },
        { level: 0, sector: 11, particle: { color: 'green' } },
        { level: 1, sector: 11, particle: { color: 'green' } },
        { level: 2, sector: 11, particle: { color: 'green' } },
        { level: 0, sector: 3, particle: { color: 'green' } },
        { level: 1, sector: 3, particle: { color: 'green' } },
        { level: 2, sector: 3, particle: { color: 'green' } },
        { level: 0, sector: 4, particle: { color: 'green' } },
        { level: 1, sector: 4, particle: { color: 'green' } },
        { level: 2, sector: 4, particle: { color: 'green' } },    
        { level: 0, sector: 7, particle: { color: 'green' } },
        { level: 1, sector: 7, particle: { color: 'green' } },
        { level: 2, sector: 7, particle: { color: 'green' } },
        { level: 0, sector: 8, particle: { color: 'green' } },
        { level: 1, sector: 8, particle: { color: 'green' } },
        { level: 2, sector: 8, particle: { color: 'green' } },    
      ]
    },
    { 
      name: 'Pure Power Nucleus',
      color: 'green',
      loose: false, 
      nucleus: { particles: { red: 0, green: 1, blue: 0 } },
      cells: [] 
    },
    { 
      name: 'Elementary Power',
      color: 'green',
      loose: true, 
      nucleus: { particles: { red: 0, green: 1, blue: 0 } }, 
      cells: []
    },
    { 
      name: 'Great Will Flower', 
      color: 'blue',
      loose: false, 
      nucleus: { particles: { red: 0, green: 0, blue: 1 } }, 
      cells: [
        { level: 0, sector: 0, particle: { color: 'blue' } },
        { level: 1, sector: 0, particle: { color: 'blue' } },
        { level: 2, sector: 0, particle: { color: 'blue' } },
        { level: 0, sector: 11, particle: { color: 'blue' } },
        { level: 1, sector: 11, particle: { color: 'blue' } },
        { level: 2, sector: 11, particle: { color: 'blue' } },
        { level: 0, sector: 3, particle: { color: 'blue' } },
        { level: 1, sector: 3, particle: { color: 'blue' } },
        { level: 2, sector: 3, particle: { color: 'blue' } },
        { level: 0, sector: 4, particle: { color: 'blue' } },
        { level: 1, sector: 4, particle: { color: 'blue' } },
        { level: 2, sector: 4, particle: { color: 'blue' } },    
        { level: 0, sector: 7, particle: { color: 'blue' } },
        { level: 1, sector: 7, particle: { color: 'blue' } },
        { level: 2, sector: 7, particle: { color: 'blue' } },
        { level: 0, sector: 8, particle: { color: 'blue' } },
        { level: 1, sector: 8, particle: { color: 'blue' } },
        { level: 2, sector: 8, particle: { color: 'blue' } },    
      ]
    },
    { 
      name: 'Hollow Will Flower',
      color: 'blue',
      loose: false,
      nucleus: { particles: { red: 0, green: 0, blue: 0 } },
      cells: [
        { level: 0, sector: 0, particle: { color: 'blue' } },
        { level: 1, sector: 0, particle: { color: 'blue' } },
        { level: 2, sector: 0, particle: { color: 'blue' } },
        { level: 0, sector: 11, particle: { color: 'blue' } },
        { level: 1, sector: 11, particle: { color: 'blue' } },
        { level: 2, sector: 11, particle: { color: 'blue' } },
        { level: 0, sector: 3, particle: { color: 'blue' } },
        { level: 1, sector: 3, particle: { color: 'blue' } },
        { level: 2, sector: 3, particle: { color: 'blue' } },
        { level: 0, sector: 4, particle: { color: 'blue' } },
        { level: 1, sector: 4, particle: { color: 'blue' } },
        { level: 2, sector: 4, particle: { color: 'blue' } },    
        { level: 0, sector: 7, particle: { color: 'blue' } },
        { level: 1, sector: 7, particle: { color: 'blue' } },
        { level: 2, sector: 7, particle: { color: 'blue' } },
        { level: 0, sector: 8, particle: { color: 'blue' } },
        { level: 1, sector: 8, particle: { color: 'blue' } },
        { level: 2, sector: 8, particle: { color: 'blue' } },    
      ]
    },
    { 
      name: 'Pure Will Nucleus',
      color: 'blue',
      loose: false, 
      nucleus: { particles: { red: 0, green: 0, blue: 1 } },
      cells: [] 
    },
    { 
      name: 'Elementary Will',
      color: 'blue',
      loose: true, 
      nucleus: { particles: { red: 0, green: 0, blue: 1 } }, 
      cells: []
    },
  ]
}