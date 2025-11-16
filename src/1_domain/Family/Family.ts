/*
6. Entidad Core - Familia (Family)
typescript
// domain/entities/Family.ts
export interface Family {
  id: string;
  name: string;
  createdBy: string;
  members: FamilyMember[];
  sharedCategories: string[];
  totalBudget: number;
  isActive: boolean;
  createdAt: Date;
}
*/

//consideraciones: el usuario creador siempre debe ser admin, asegurar eso.

export interface FamilyMember {
  userId: string;
  role: 'admin' | 'member';
  joinedAt: Date;
}

export class Family{

    constructor(
        public id: string, //id de mongo
        public name: string,
        public createdBy: string, // id del usuario creador, siempre necesario
        public members: FamilyMember[], // un dto que coje solo ciertos valores de nuestra familia. Probar si puedo usar esto para hacer un populate
        public sharedCategories: string[], //categorias que existan en nuestra base de datos o que el usuario haya creado.
        public totalBudget: number,
        public isActive: boolean = true,
        public createdAt:Date = new Date()
    ){

    }
} 