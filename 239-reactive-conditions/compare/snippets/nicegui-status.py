def status_line():
    match state['status']:
        case 'loading':
            ui.label('Loading…').classes('out italic')
        case 'error':
            ui.label("Couldn't load").classes('out font-bold')
        case _:
            ui.label('3 messages').classes('out')
