speed = {'s': 0.1}

def toggle():
    state['running'] = not state['running']
    if state['running']:
        ui.timer(speed['s'], lambda: state.update(ticks=state['ticks'] + 1))
