import os
from pathlib import Path
from nicegui import ui

CSS = (Path(__file__).parent / 'page.css').read_text()


def counter():
    n = {'value': 0}
    with ui.element('div').classes('panel') as panel:
        ui.label().classes('count').bind_text_from(n, 'value', backward=lambda v: f'Clicked {v}')
        ui.button('+1', on_click=lambda: n.update(value=n['value'] + 1))
    return panel


@ui.page('/')
def index():
    ui.add_css(CSS)
    ui.page_title('NiceGUI')
    state = {'open': False, 'status': 'loading', 'unread': 0, 'joining': False, 'shown': True}

    def flip(k):
        state[k] = not state[k]

    with ui.element('main'):
        ui.label('NiceGUI').classes('h1')
        with ui.element('section').classes('box box-details'):
            ui.label('Details').classes('h2')
            ui.button(on_click=lambda: flip('open')).bind_text_from(
                state, 'open', backward=lambda o: 'Hide details' if o else 'Show details')
            ui.label('Ships in 2 days.').classes('out').bind_visibility_from(state, 'open')

        with ui.element('section').classes('box box-status'):
            ui.label('Status').classes('h2')

            @ui.refreshable
            def status_line():
                match state['status']:
                    case 'loading':
                        ui.label('Loading…').classes('out italic')
                    case 'error':
                        ui.label("Couldn't load").classes('out font-bold')
                    case _:
                        ui.label('3 messages').classes('out')

            def set_status(s):
                state['status'] = s
                status_line.refresh()

            for s in ['loading', 'error', 'ready']:
                ui.button(s.title(), on_click=lambda s=s: set_status(s))
            status_line()

        with ui.element('section').classes('box box-zero'):
            ui.label('Unread').classes('h2')
            ui.button('+1 unread', on_click=lambda: state.update(unread=state['unread'] + 1))
            ui.button('Read all', on_click=lambda: state.update(unread=0))
            with ui.row().classes('out items-center'):
                ui.label('Inbox')
                ui.label().classes('badge').bind_text_from(state, 'unread', backward=lambda n: f'{n} new') \
                    .bind_visibility_from(state, 'unread', backward=lambda n: n > 0)

        with ui.element('section').classes('box box-switch wide'):
            ui.label('Log in or sign up').classes('h2')

            @ui.refreshable
            def email():
                if state['joining']:
                    ui.input(placeholder='Work email').props('aria-label="Work email"')
                else:
                    ui.input(placeholder='Your email').props('aria-label="Your email"')

            def switch():
                flip('joining')
                email.refresh()

            ui.button(on_click=switch).bind_text_from(
                state, 'joining', backward=lambda j: 'I have an account' if j else "I'm new here")
            email()

        with ui.element('section').classes('box box-keep'):
            ui.label('Counter').classes('h2')
            ui.button(on_click=lambda: flip('shown')).bind_text_from(
                state, 'shown', backward=lambda s: 'Hide counter' if s else 'Show counter')
            counter().bind_visibility_from(state, 'shown')


ui.run(host='127.0.0.1', port=int(os.environ.get('PORT', 8132)), reload=False, show=False, title='NiceGUI')
