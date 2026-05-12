class Parquimetro {
  constructor() {
    this.tableValues = [
      { value: 1.0, time: 30 },
      { value: 1.75, time: 60 },
      { value: 3.0, time: 120 },
    ];
  }

  isValidValue(value) {
    if (isNaN(value) || value < 1) {
      return false;
    }

    return true;
  }

  calcValue(value) {
    if (!this.isValidValue(value)) {
      return {
        success: false,
        message: "Valor inválido. Digite um valor válido",
      };
    }

    if (value < 1) {
      return {
        success: false,
        message: "Valor insuficiente.  Mínimo R$ 1,00",
      };
    }

    let time = 0;
    let exchange = 0;
    let currentTrack = null;
    let nextTrack = null;

    if (value >= 1 && value < 1.75) {
      currentTrack = this.tableValues[0];
      nextTrack = this.tableValues[1]
    } else if (value >= 1.75 && value < 3) {
      currentTrack = this.tableValues[1];
      nextTrack = this.tableValues[2]
    } else {
      currentTrack = this.tableValues[2]
    }

  }
}
