with ui.element('section').classes('box box-details'):
    ui.label('Details').classes('h2')
    ui.button(on_click=lambda: flip('open')).bind_text_from(
        state, 'open', backward=lambda o: 'Hide details' if o else 'Show details')
    ui.label('Ships in 2 days.').classes('out').bind_visibility_from(state, 'open')
