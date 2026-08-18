(() => {
  'use strict';

  const state = { step: 0, editing: false, rejected: false };
  const actionContent = document.querySelector('#actionContent');
  const actionPanel = document.querySelector('#actionPanel');
  const progressLabel = document.querySelector('#progressLabel');
  const confirmedMetric = document.querySelector('#confirmedMetric');
  const confirmedMetricNote = document.querySelector('#confirmedMetricNote');
  const savedMetric = document.querySelector('#savedMetric');
  const steps = [...document.querySelectorAll('.journey-step')];
  const lines = [...document.querySelectorAll('.journey-line')];

  const copy = {
    0: { kicker: 'SIGUIENTE ACCIÓN', icon: '✦', title: 'Analiza el mensaje de Lucía', body: 'Detecta automáticamente el inmueble, la intención y la urgencia del lead para preparar el siguiente paso.', button: 'Analizar mensaje' },
    1: { kicker: 'INMUEBLE IDENTIFICADO', icon: '⌖', title: 'Hemos encontrado el inmueble adecuado', body: 'El mensaje coincide con el Ático Santa Engracia. La ficha ya está lista para cualificar la oportunidad.', button: 'Cualificar lead' },
    2: { kicker: 'CUALIFICACIÓN OPERATIVA', icon: '✓', title: 'Lead cualificado para visita', body: 'La intención es alta: busca 3 habitaciones, conoce la zona y ha indicado disponibilidad por las tardes.', button: 'Generar respuesta' },
  };

  function render() {
    steps.forEach((step, index) => {
      step.classList.toggle('active', index === state.step);
      step.classList.toggle('completed', index < state.step);
      const marker = step.querySelector('span');
      marker.textContent = index < state.step ? '✓' : String(index + 1);
    });
    lines.forEach((line, index) => line.classList.toggle('complete', index < state.step));
    progressLabel.textContent = `Paso ${Math.min(state.step + 1, 5)} de 5`;

    if (state.rejected) {
      actionContent.innerHTML = `<div class="action-kicker"><span class="status-icon">!</span> REVISIÓN DETENIDA</div><h3>La propuesta necesita una nueva revisión</h3><p>El borrador se ha rechazado y no se ha enviado nada. Puedes reabrirlo cuando el equipo tenga una nueva indicación.</p><button class="primary-button" data-action="reopen">Reabrir revisión</button>`;
      return;
    }

    if (state.step <= 2) {
      const item = copy[state.step];
      actionContent.innerHTML = `<div class="action-kicker"><span class="status-icon">${item.icon}</span> ${item.kicker}</div><h3>${item.title}</h3><p>${item.body}</p>${state.step === 1 ? `<div class="action-grid"><div class="data-box"><h4>Señales detectadas</h4><div class="pill-row"><span class="pill good">✓ Inmueble exacto</span><span class="pill good">✓ Quiere visitar</span><span class="pill">Tardes</span></div></div><div class="data-box"><h4>Agente asignado</h4><p><strong>Álvaro Gil</strong><br><span class="muted">Disponible ahora</span></p></div></div>` : ''}<button class="primary-button" data-action="advance">${item.button} <span>→</span></button>`;
      return;
    }

    if (state.step === 3) {
      actionContent.innerHTML = `<div class="action-kicker"><span class="status-icon">✎</span> BORRADOR LISTO · REVISIÓN HUMANA</div><h3>Revisa antes de proponer la visita</h3><div class="draft-box" id="draftBox"><strong>Hola, Lucía:</strong><br>¡Gracias por tu interés en el Ático Santa Engracia! Sí, sigue disponible. Álvaro, nuestro agente, puede enseñártelo esta semana por la tarde.</div><div class="slot-list"><button class="slot selected" type="button">Mié 21 · <strong>17:30</strong></button><button class="slot" type="button">Jue 22 · <strong>18:00</strong></button><button class="slot" type="button">Vie 23 · <strong>16:30</strong></button></div><div class="review-actions"><button class="primary-button approve-button" data-action="approve">Aprobar y proponer <span>→</span></button><button class="primary-button edit-button" data-action="edit">Editar</button><button class="primary-button reject-button" data-action="reject">Rechazar</button></div><div class="action-foot"><span class="review-tag"><span>●</span> Ningún mensaje se enviará sin tu aprobación</span><span class="muted">Marina Ríos · tú</span></div>`;
      return;
    }

    actionContent.innerHTML = `<div class="success-state"><span class="success-icon">✓</span><div><div class="action-kicker">VISITA PROPUESTA</div><h3>Todo listo para Lucía</h3><p>La propuesta está preparada con 3 opciones de horario.</p></div></div><div class="reminder-row"><div class="reminder"><small>Próximo paso</small><strong>Esperando elección del lead</strong></div><div class="reminder"><small>Recordatorio automático</small><strong>24 h antes de la visita</strong></div></div><div class="action-foot"><span class="review-tag"><span>✓</span> CRM actualizado · Hace unos segundos</span><button class="secondary-button" data-action="reset">Ver nuevo lead</button></div>`;
  }

  function updateTimeline(key, title, detail) {
    const item = document.querySelector(`[data-timeline="${key}"]`);
    if (!item) return;
    item.classList.remove('pending');
    item.classList.add('completed');
    item.querySelector('.timeline-dot').textContent = '✓';
    item.querySelector('strong').textContent = title;
    item.querySelector('small').textContent = detail;
  }

  function toast(message) {
    document.querySelector('.toast')?.remove();
    const node = document.createElement('div');
    node.className = 'toast';
    node.innerHTML = `<span>✓</span>${message}`;
    document.body.appendChild(node);
    window.setTimeout(() => node.remove(), 2800);
  }

  function advance() {
    if (state.step < 3) state.step += 1;
    if (state.step === 1) { updateTimeline('identified', 'Inmueble identificado', 'Ático Santa Engracia · 98% match'); toast('Inmueble identificado en la cartera'); }
    if (state.step === 2) { updateTimeline('qualified', 'Lead cualificado', 'Interés alto · Quiere visitar'); toast('Lead cualificado para visita'); }
    if (state.step === 3) toast('Borrador preparado para revisión humana');
    render();
  }

  actionPanel.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (target) {
      const action = target.dataset.action;
      if (action === 'advance') advance();
      if (action === 'approve') {
        state.step = 4;
        confirmedMetric.textContent = '1';
        confirmedMetricNote.textContent = 'Propuesta enviada · hace unos segundos';
        savedMetric.textContent = '24';
        updateTimeline('visit', 'Visita propuesta', '3 opciones · Esperando respuesta');
        toast('Propuesta aprobada y registrada en el CRM');
        render();
      }
      if (action === 'reject') { state.rejected = true; toast('Borrador rechazado · No se ha enviado nada'); render(); }
      if (action === 'reopen') { state.rejected = false; state.step = 3; render(); }
      if (action === 'reset') reset();
      if (action === 'edit') {
        const box = document.querySelector('#draftBox');
        box.innerHTML = `<textarea class="edit-area" aria-label="Editar borrador">Hola, Lucía:\n¡Gracias por tu interés en el Ático Santa Engracia! Sí, sigue disponible. Álvaro, nuestro agente, puede enseñártelo esta semana por la tarde.</textarea><div class="action-foot"><span class="review-tag"><span>✎</span> Editando borrador</span><button class="primary-button" data-action="save-edit">Guardar cambios</button></div>`;
        target.style.display = 'none';
      }
      if (action === 'save-edit') { toast('Cambios guardados en el borrador'); render(); }
    }
    const slot = event.target.closest('.slot');
    if (slot) { document.querySelectorAll('.slot').forEach((item) => item.classList.remove('selected')); slot.classList.add('selected'); }
  });

  document.querySelector('.reset-button').addEventListener('click', reset);
  document.querySelector('.bookmark').addEventListener('click', (event) => { event.currentTarget.textContent = event.currentTarget.textContent === '♡' ? '♥' : '♡'; toast(event.currentTarget.textContent === '♥' ? 'Inmueble guardado' : 'Inmueble eliminado de guardados'); });

  function reset() {
    state.step = 0; state.rejected = false;
    confirmedMetric.textContent = '0'; confirmedMetricNote.textContent = 'Pendiente de aprobación'; savedMetric.textContent = '18';
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
      if (index === 0) return;
      item.classList.remove('completed'); item.classList.add('pending');
      item.querySelector('.timeline-dot').textContent = String(index + 1);
      item.querySelector('small').textContent = index === 3 ? 'Esperando aprobación' : 'Esperando análisis';
    });
    render(); toast('Demo reiniciada');
  }

  render();
})();
