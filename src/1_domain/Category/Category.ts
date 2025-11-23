// domain/entities/Category.ts

//Entidad Category para asegurar consistencia de datos
export class Category {
  constructor(
    public id: string, //id de UUID4 o mongodb stringificada.
    public name: string,
    public description: string,
    public isActive: boolean = true,
    public profileId?: string, //no todos serán creados por un usuario. Si es null o vacio, sabemos que es nuestro
    public type?: 'income' | 'expense' | 'both',
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ){
    this.validateName(name);
    this.validateDescription(description);
  }

  private validateName(name: string) {
    const regexName = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/;
    if(!regexName.test(name)) throw new Error("Name not allowed, please use only letters.");
  }

  private validateDescription(description: string) {
    const regexDescription = /<script>|<\/script>/i;
    if(regexDescription.test(description)) throw new Error("Description not allowed, please try again.");
  }
}
