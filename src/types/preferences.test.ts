import { describe, expect, it } from 'vitest'
import {
  COMMANDCODE_DEFAULT_MAGIC_PROMPT_BACKENDS,
  COMMANDCODE_DEFAULT_MAGIC_PROMPT_MODELS,
  defaultPreferences,
  GROK_DEFAULT_MAGIC_PROMPT_BACKENDS,
  PI_DEFAULT_MAGIC_PROMPT_BACKENDS,
  PI_DEFAULT_MAGIC_PROMPT_MODELS,
  getEditorLabel,
  getOpenInDefaultLabel,
  resolveEditorCommand,
  resolveMagicPromptBackend,
  resolveMagicPromptProvider,
} from './preferences'

describe('magic prompt preference resolvers', () => {
  it('enables web access sounds by default for backwards compatibility', () => {
    expect(defaultPreferences.web_access_sounds_enabled).toBe(true)
  })

  it('uses Jean-managed Command Code CLI by default', () => {
    expect(defaultPreferences.commandcode_cli_source).toBe('jean')
  })

  it('uses Jean-managed Grok CLI by default', () => {
    expect(defaultPreferences.grok_cli_source).toBe('jean')
  })

  it('provides magic prompt defaults for Pi', () => {
    expect(PI_DEFAULT_MAGIC_PROMPT_BACKENDS.investigate_issue_backend).toBe(
      'pi'
    )
    expect(PI_DEFAULT_MAGIC_PROMPT_MODELS.investigate_issue_model).toBe(
      'pi/sonnet'
    )
  })

  it('provides magic prompt defaults for Command Code', () => {
    expect(
      COMMANDCODE_DEFAULT_MAGIC_PROMPT_BACKENDS.investigate_issue_backend
    ).toBe('commandcode')
    expect(
      COMMANDCODE_DEFAULT_MAGIC_PROMPT_MODELS.investigate_issue_model
    ).toBe('commandcode/default')
  })

  it('provides magic prompt defaults for Grok', () => {
    expect(GROK_DEFAULT_MAGIC_PROMPT_BACKENDS.investigate_issue_backend).toBe(
      'grok'
    )
  })

  it('keeps automatic recaps on by default', () => {
    expect(defaultPreferences.auto_recaps_enabled).toBe(true)
  })

  it('uses the custom editor command for labels and invocation values', () => {
    expect(getEditorLabel('custom', 'codium')).toBe('Codium')
    expect(getEditorLabel('custom', '/usr/bin/codium')).toBe('Codium')
    expect(
      getOpenInDefaultLabel('editor', 'custom', 'terminal', 'codium')
    ).toBe('Codium')
    expect(resolveEditorCommand('custom', ' codium ')).toBe('codium')
  })

  it('preserves built-in editor ids when resolving editor commands', () => {
    expect(resolveEditorCommand('vscode', 'codium')).toBe('vscode')
    expect(resolveEditorCommand('cursor')).toBe('cursor')
  })

  it('prefers explicit backend overrides', () => {
    expect(
      resolveMagicPromptBackend(
        { investigate_issue_backend: 'codex' } as never,
        'investigate_issue_backend',
        'claude'
      )
    ).toBe('codex')
  })

  it('falls back to the provided default backend when unset', () => {
    expect(
      resolveMagicPromptBackend(undefined, 'investigate_issue_backend', 'codex')
    ).toBe('codex')
  })

  it('preserves explicit anthropic provider selection', () => {
    expect(
      resolveMagicPromptProvider(
        { investigate_issue_provider: null } as never,
        'investigate_issue_provider',
        'OpenRouter'
      )
    ).toBeNull()
  })
})
