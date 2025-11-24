export class Category {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public icon: string, // util para mi frontend
    public type: 'income' | 'expense' | 'both' = 'expense',
    public isActive: boolean = true,
    public profileId?: string, // Si es null/undefined = Categoría Global del Sistema
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {
    this.validateName(name);

  }

  private validateName(name: string) {
    // Regex mejorada: Permite letras, números y espacios (Ej: "Casa 2")
    const regexName = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s\-\&]+$/;

    if (!regexName.test(name)) {
      throw new Error("El nombre contiene caracteres inválidos.");
    }
    if (name.length < 3) {
      throw new Error("El nombre es muy corto.");
    }
  }
}