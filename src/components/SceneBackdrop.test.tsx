import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SceneBackdrop } from './SceneBackdrop'
import { HOME_SLIDESHOW } from './scenes'

function imageSources(container: HTMLElement): string[] {
  return [...container.querySelectorAll('img')].map((image) => image.getAttribute('src') ?? '')
}

describe('SceneBackdrop', () => {
  it('loads the first home slide eagerly and keeps the rest out of the initial payload', () => {
    const { container } = render(<SceneBackdrop scene="home" />)
    const images = [...container.querySelectorAll('img')]

    expect(images).toHaveLength(1)
    expect(images[0]).toHaveAttribute('src', HOME_SLIDESHOW[0])
    expect(images[0]).toHaveAttribute('loading', 'eager')
    expect(images[0]).toHaveAttribute('fetchpriority', 'high')
    expect(imageSources(container)).toEqual([HOME_SLIDESHOW[0]])
  })

  it('requests the next slide only after the current one has loaded', () => {
    const { container } = render(<SceneBackdrop scene="home" />)
    const first = container.querySelector('img')
    expect(first).not.toBeNull()
    fireEvent.load(first!)

    const sources = imageSources(container)
    expect(sources).toEqual([HOME_SLIDESHOW[0], HOME_SLIDESHOW[1]])
    expect(container.querySelectorAll('img')[1]).toHaveAttribute('loading', 'lazy')
  })

  it('loads a single backdrop for the login scene', () => {
    const { container } = render(<SceneBackdrop scene="login" />)
    const images = [...container.querySelectorAll('img')]

    expect(images).toHaveLength(1)
    expect(images[0]).toHaveAttribute('src', '/scenes/scene-dawn-lake.webp')
    expect(images[0]).toHaveAttribute('loading', 'eager')
  })
})
