@ui.refreshable
def shopping():
    with ui.element('ul'):
        for t in TODOS:
            if state['show_done'] or not t['done']:
                with ui.element('li'):
                    ui.label(t['text'])

def set_show_done(e):
    state['show_done'] = e.value
    shopping.refresh()
