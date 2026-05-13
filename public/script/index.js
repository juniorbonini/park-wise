const getElement = (id) => document.getElementById(id);

class ParkAssistant {
  constructor() {
    this.tableValues = [
      { value: 1.0, time: 30 },
      { value: 1.75, time: 60 },
      { value: 3.0, time: 120 },
    ];
  }

  isValidValue(value) {
    if (isNaN(value) || value <= 0) {
      return false;
    }

    return true;
  }

  calcValue(value) {
    if (!this.isValidValue(value)) {
      return {
        success: false,
        message: "Digite um valor válido.",
      };
    }

    if (value < 1) {
      return {
        success: false,
        message: "Valor insuficiente. Mínimo: R$ 1,00.",
      };
    }

    let time = 0;
    let exchange = 0;
    let currentTrack = null;
    let nextTrack = null;

    if (value >= 1 && value < 1.75) {
      currentTrack = this.tableValues[0];
      nextTrack = this.tableValues[1];
    } else if (value >= 1.75 && value < 3) {
      currentTrack = this.tableValues[1];
      nextTrack = this.tableValues[2];
    } else {
      currentTrack = this.tableValues[2];
    }

    time = currentTrack.time;

    exchange = value - currentTrack.value;

    return {
      success: true,
      time,
      exchange,
      valueEntered: value,
      currentTrack,
      nextTrack,
    };
  }
}

class InterfaceParkAssistant {
  constructor() {
    this.parkAssistant = new ParkAssistant();

    this.inputValue = getElement("value");
    this.button = getElement("btn");
    this.result = getElement("result");
    this.historic = getElement("historic");
    this.progressText = getElement("progressText");
    this.progressFill = getElement("progressFill");
    this.recommendationCard = getElement("recommendationCard");
    this.recommendationText = getElement("recommendationText");
    this.button.addEventListener("click", () => this.calc());
    this.loadHistory();
  }

  calc() {
    const value = Number(this.inputValue.value);

    this.result.innerHTML = "Analisando melhor opção...";

    setTimeout(() => {
      const res = this.parkAssistant.calcValue(value);

      this.showResult(res);
      this.attHistory(res);
      this.clearField();
    }, 800);
  }

  showResult(res) {
    if (!res.success) {
      this.result.innerHTML = res.message;

      this.recommendationCard.classList.add("hidden");

      this.progressFill.style.width = "0%";

      this.progressText.textContent = "0%";

      return;
    }

    this.result.innerHTML = `
      <strong>Tempo:</strong>
      ${res.time} minutos
      <br><br>

      <strong>Troco:</strong>
      ${this.formatValue(res.exchange)}
    `;

    this.attProgressBar(res);

    this.showRecommendation(res);
  }

  attProgressBar(res) {
    if (!res.nextTrack) {
      this.progressFill.style.width = "100%";

      this.progressText.textContent = "Plano máximo atingido";

      return;
    }

    const actualValue = res.valueEntered;
    const baseValue = res.currentTrack.value;
    const maxValue = res.nextTrack.value;
    const progress = ((actualValue - baseValue) / (maxValue - baseValue)) * 100;
    this.progressFill.style.width = `${progress}%`;
    this.progressText.textContent = `${Math.floor(progress)}%`;
  }

  showRecommendation(res) {
    if (!res.nextTrack) {
      this.recommendationCard.classList.remove("hidden");

      this.recommendationText.textContent = `
        Você desbloqueou o plano máximo
        disponível do ParkWise AI.
        `;

      return;
    }

    const missingValue = res.nextTrack.value - res.valueEntered;

    this.recommendationCard.classList.remove("hidden");

    this.recommendationText.innerHTML = `
      Adicione apenas
      <strong>
        ${this.formatValue(missingValue)}
      </strong>

      para desbloquear
      <strong>
        ${res.nextTrack.time} minutos
      </strong>

      de permanência.
      `;
  }

  attHistory(res) {
    if (!res.success) return;

    const item = `
      <li>
        ${this.formatValue(res.valueEntered)}
        → ${res.time} minutos
      </li>
    `;

    let historic = JSON.parse(localStorage.getItem("historic")) || [];

    historic.unshift(item);

    historic = historic.slice(0, 5);

    localStorage.setItem("historic", JSON.stringify(historic));

    this.renderHistory(historic);
  }

  loadHistory() {
    const history = JSON.parse(localStorage.getItem("historic")) || [];

    this.renderHistory(history);
  }

  renderHistory(history) {
    this.historic.innerHTML = history.join("");
  }

  clearField() {
    this.inputValue.value = "";
  }

  formatValue(value) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }
}

new InterfaceParkAssistant();
