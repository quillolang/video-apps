timer = ui.timer(0.1, lambda: state.update(ticks=state['ticks'] + 1), active=False)

def toggle():
    state['running'] = not state['running']
    timer.active = state['running']
# ...
ui.button('Faster', on_click=lambda: setattr(timer, 'interval', timer.interval / 2))
ui.label().classes('out').bind_text_from(state, 'ticks', backward=lambda t: f'{t} ticks')
ui.input(placeholder='A note, while it runs').props('aria-label="Note"').bind_visibility_from(state, 'running')
