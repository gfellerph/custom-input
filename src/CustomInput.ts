import { html, LitElement, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { styles } from './custom-input.style.js';

export class CustomInput extends LitElement {
  static styles = styles;

  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: false,
  };

  @query('input') private input!: HTMLInputElement;

  @property({ type: String }) accessor label!: string;

  @property({ type: String }) accessor datalist = '';

  @property({ type: String }) accessor placeholder = '';

  @property({ type: Boolean }) accessor clearable = false;

  @property({ type: String }) accessor suggest = 'chocolate';

  @state() private valid = false;

  @state() private touched = false;

  @state() private suggestion = '';

  #renderDataList() {
    return html`
      <datalist id="datalist">
        ${this.datalist
          .split(',')
          .map(option => html`<option value=${option.trim()}></option>`)}
      </datalist>
    `;
  }

  #renderSuggest() {
    return html`<span class="suggestion">${this.suggestion}</span>`;
  }

  #updateSuggestion() {
    if (!this.input || !this.suggest || this.input.value === '') {
      this.suggestion = '';
      return;
    }
    const [tail] = this.input.value.split(' ').slice(-1);
    if (tail.trim() === '') {
      this.suggestion = '';
      return;
    }
    this.suggestion =
      this.suggest.toLowerCase().indexOf(tail.toLowerCase().trim()) === 0
        ? this.suggest.replace(new RegExp(tail, 'i'), '')
        : '';
  }

  #handleInput() {
    this.#updateSuggestion();
  }

  #handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab' && this.suggestion) {
      event.preventDefault();
      this.input.value += this.suggestion;
      this.suggestion = '';
    }
  }

  #handleWrapperClick() {
    this.input.focus();
  }

  #handleClearClick() {
    this.input.value = '';
    this.input.focus();
  }

  render() {
    // eslint-disable-next-line lit-a11y/click-events-have-key-events
    return html`<div class="wrapper" @click=${this.#handleWrapperClick}>
        <slot name="prefix"></slot>
        <input
          id="input"
          type="text"
          placeholder=${this.placeholder || nothing}
          list=${this.datalist ? 'datalist' : nothing}
          autocomplete=${this.suggest ? 'off' : nothing}
          @input=${this.#handleInput}
          @keydown=${this.#handleKeyDown}
        />${(this.suggest && this.#renderSuggest()) || nothing}
        <label for="input"></label>

        <slot name="postfix"></slot>
        <div class="actions">
          <slot name="actions"></slot>
        </div>
        ${(this.clearable &&
          html`<button
            type="button"
            aria-label="clear input"
            @click=${this.#handleClearClick}
          >
            x
          </button>`) ||
        nothing}
        ${(this.touched &&
          this.valid &&
          html`<span aria-hidden="true">✅</span>`) ||
        nothing}
        ${(this.touched &&
          !this.valid &&
          html`<span aria-hidden="true">❌</span>`) ||
        nothing}
      </div>
      ${this.datalist && this.#renderDataList()}`;
  }
}
