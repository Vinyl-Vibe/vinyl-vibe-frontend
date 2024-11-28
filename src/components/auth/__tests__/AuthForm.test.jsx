import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../../store/auth'
import AuthForm from '../AuthForm'

// Rest of the file stays the same... 