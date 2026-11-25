@ui.refreshable
def unread_line():
    if state['unread'] == 0:
        ui.label('All read').classes('out')
    elif state['unread'] == 1:
        ui.label('1 new message').classes('out')
    else:
        ui.label(f"{state['unread']} new messages").classes('out font-bold')

def set_unread(n):
    state['unread'] = n
    unread_line.refresh()
