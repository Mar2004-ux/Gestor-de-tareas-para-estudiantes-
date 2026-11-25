import assert from 'node:assert/strict'
import { test } from 'node:test'
import { clasificar, hoyEnBogota } from '../src/lib/tareas.ts'

test('la fecha cambia a medianoche de Bogotá', () => {
  assert.equal(hoyEnBogota(new Date('2026-11-25T04:59:59Z')), '2026-11-24')
  assert.equal(hoyEnBogota(new Date('2026-11-25T05:00:00Z')), '2026-11-25')
})

test('clasifica pendientes antes, durante y después del plazo de urgencia', () => {
  const hoy = '2026-11-24'
  const fechas = [
    ['2026-11-23', 'atrasada'],
    ['2026-11-24', 'urgente'],
    ['2026-11-25', 'urgente'],
    ['2026-11-26', 'urgente'],
    ['2026-11-27', 'normal'],
  ]
  for (const [fecha_limite, esperado] of fechas) {
    assert.equal(clasificar({ estado: 'pendiente', fecha_limite }, hoy), esperado)
  }
})

test('una tarea completada queda fuera de la clasificación por fecha', () => {
  assert.equal(clasificar({ estado: 'completada', fecha_limite: '2026-11-23' }, '2026-11-24'), null)
})
