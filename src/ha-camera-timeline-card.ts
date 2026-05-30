import { LitElement, html, css, CSSResultGroup, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, fireEvent } from 'custom-card-helpers';

const CARD = 'ha-camera-timeline-card';
console.info(`%c 📷 CAMERA-TIMELINE %c v1.0.0 `,'color:#fff;background:#3b82f6;font-weight:700;border-radius:4px 0 0 4px;padding:2px 6px;','color:#fff;background:#6b7280;font-weight:700;border-radius:0 4px 4px 0;padding:2px 6px;');

interface CameraConfig { type: string; title?: string; cameras?: string[]; hours_back?: number; show_snapshots?: boolean; }

@customElement(CARD)
export class CameraTimelineCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public config!: CameraConfig;
  @state() private _events: Array<{ camera: string; time: string; label: string; entity_id: string }> = [];

  public static getStubConfig(): CameraConfig { return { type: CARD, title: '📷 Camera Timeline', cameras: ['camera.cameraintrare_snapshots_sub', 'camera.cameraterasa_snapshots_sub'], hours_back: 24, show_snapshots: true }; }

  setConfig(config: CameraConfig): void {
    if (!config) throw new Error('Invalid config');
    this.config = { type: CARD, title: '📷 Camera Timeline', cameras: [], hours_back: 24, show_snapshots: true, ...config };
  }

  updated(changedProps: Map<string, unknown>): void {
    super.updated(changedProps);
    if (changedProps.has('hass') && this.hass) this._compute();
  }

  private _compute(): void {
    if (!this.hass) return;
    const events: CameraTimelineCard['_events'] = [];
    const cameras = this.config.cameras || [];

    // Find Frigate sensors for detection events
    for (const [id, entity] of Object.entries(this.hass.states)) {
      if (!id.includes('frigate') || !id.includes('last_camera')) continue;
      if (entity.state === 'Unknown') continue;
      const mins = Math.floor((Date.now() - new Date(entity.last_changed).getTime()) / 60000);
      events.push({
        camera: entity.state,
        time: mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)}h`,
        label: `Detecție pe ${entity.state}`,
        entity_id: id,
      });
    }

    // Find LLM Vision events
    for (const [id, entity] of Object.entries(this.hass.states)) {
      if (!id.includes('llm_vision') && !id.includes('llmvision')) continue;
      if (entity.state === 'unavailable') continue;
      const mins = Math.floor((Date.now() - new Date(entity.last_changed).getTime()) / 60000);
      events.push({
        camera: 'LLM Vision',
        time: mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)}h`,
        label: entity.state.substring(0, 50),
        entity_id: id,
      });
    }

    events.sort((a, b) => a.time.localeCompare(b.time));
    this._events = events.slice(0, 20);
  }

  getCardSize() { return 3; }

  protected render(): TemplateResult | typeof nothing {
    if (!this.config || !this.hass) return nothing;
    const cameras = this.config.cameras || [];

    return html`
      <ha-card>
        <div class="header">
          <div class="header-icon">📷</div>
          <div class="header-text">
            <div class="header-title">${this.config.title || 'Camera Timeline'}</div>
            <div class="header-sub">${this._events.length} evenimente</div>
          </div>
        </div>

        ${this.config.show_snapshots && cameras.length > 0 ? html`
          <div class="snapshots">
            ${cameras.map(cam => {
              const entity = this.hass.states[cam];
              if (!entity) return nothing;
              return html`
                <div class="snapshot" @click=${() => fireEvent(this, 'hass-more-info', { entityId: cam })}>
                  <ha-icon icon="mdi:cctv"></ha-icon>
                  <span>${(entity.attributes as Record<string, unknown>)?.friendly_name || cam}</span>
                </div>
              `;
            })}
          </div>
        ` : nothing}

        <div class="timeline">
          ${this._events.length === 0
            ? html`<div class="empty">Fără evenimente recente</div>`
            : this._events.map(ev => html`
              <div class="event" @click=${() => fireEvent(this, 'hass-more-info', { entityId: ev.entity_id })}>
                <div class="event-dot"></div>
                <div class="event-body">
                  <div class="event-label">${ev.label}</div>
                  <div class="event-meta">📷 ${ev.camera} · ${ev.time}</div>
                </div>
              </div>
            `)}
        </div>
      </ha-card>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`
      :host { display: block; }
      ha-card { border-radius: 16px; overflow: hidden; }
      .header { display: flex; align-items: center; gap: 12px; padding: 18px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }
      .header-icon { font-size: 28px; }
      .header-text { flex: 1; }
      .header-title { font-size: 16px; font-weight: 600; color: var(--primary-text-color); }
      .header-sub { font-size: 12px; color: var(--secondary-text-color); }
      .snapshots { display: flex; gap: 8px; padding: 12px 16px; overflow-x: auto; }
      .snapshot { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; background: rgba(59,130,246,0.1); cursor: pointer; white-space: nowrap; }
      .snapshot:hover { background: rgba(59,130,246,0.2); }
      .snapshot ha-icon { --mdc-icon-size: 16px; color: #3b82f6; }
      .snapshot span { font-size: 12px; color: var(--primary-text-color); }
      .timeline { padding: 8px 16px; }
      .empty { padding: 24px; text-align: center; color: var(--secondary-text-color); }
      .event { display: flex; gap: 12px; padding: 8px 0; cursor: pointer; }
      .event:hover { background: rgba(255,255,255,0.02); }
      .event-dot { width: 8px; height: 8px; border-radius: 50%; background: #3b82f6; margin-top: 6px; flex-shrink: 0; }
      .event-body { flex: 1; }
      .event-label { font-size: 13px; color: var(--primary-text-color); }
      .event-meta { font-size: 11px; color: var(--secondary-text-color); }
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'ha-camera-timeline-card': CameraTimelineCard; } }
