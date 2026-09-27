import { render, screen } from '@testing-library/react'
import { IconUsers } from '@tabler/icons-react'
import { describe, expect, it } from 'vitest'
import { StatCard } from './stat-card'

describe('StatCard', () => {
  it('renders the label and value', () => {
    render(<StatCard label="Total meetings" value={128} />)
    expect(screen.getByText('Total meetings')).toBeInTheDocument()
    expect(screen.getByText('128')).toBeInTheDocument()
  })

  it('renders the hint when given one', () => {
    render(<StatCard label="Recordings ready" value={110} hint="86% of meetings" />)
    expect(screen.getByText('86% of meetings')).toBeInTheDocument()
  })

  it('omits the hint paragraph when none is given', () => {
    const { container } = render(<StatCard label="Total meetings" value={128} />)
    expect(container.querySelectorAll('p')).toHaveLength(1)
  })

  it('renders the icon when given one', () => {
    const { container } = render(<StatCard label="Total meetings" value={128} icon={IconUsers} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
