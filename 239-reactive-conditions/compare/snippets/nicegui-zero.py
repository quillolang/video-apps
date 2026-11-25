ui.label('Inbox')
ui.label().classes('badge').bind_text_from(state, 'unread', backward=lambda n: f'{n} new') \
    .bind_visibility_from(state, 'unread', backward=lambda n: n > 0)
