import os
from pathlib import Path

from nicegui import ui

CSS = (Path(__file__).parent / 'page.css').read_text()
TODOS = [
    {'id': 1, 'text': 'Milk', 'done': True},
    {'id': 2, 'text': 'Bread', 'done': False},
    {'id': 3, 'text': 'Eggs', 'done': False},
]


@ui.page('/')
def index():
    ui.add_css(CSS)
    ui.page_title('NiceGUI')
    state = {'unread': 0, 'running': False, 'ticks': 0, 'show_done': False, 'joining': False}

    with ui.element('main'):
        ui.label('NiceGUI').classes('h1')

        with ui.element('section').classes('box box-if'):
            ui.label('Unread').classes('h2')

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

            ui.button('+1 unread', on_click=lambda: set_unread(state['unread'] + 1))
            ui.button('Read all', on_click=lambda: set_unread(0))
            unread_line()

        with ui.element('section').classes('box box-timer'):
            ui.label('Ticker').classes('h2')
            speed = {'s': 0.1}

            def toggle():
                state['running'] = not state['running']
                if state['running']:
                    ui.timer(speed['s'], lambda: state.update(ticks=state['ticks'] + 1))

            ui.button(on_click=toggle).bind_text_from(
                state, 'running', backward=lambda r: 'Stop' if r else 'Start')
            ui.button('Faster', on_click=lambda: speed.update(s=speed['s'] / 2))
            ui.label().classes('out').bind_text_from(state, 'ticks', backward=lambda t: f'{t} ticks')
            ui.input(placeholder='A note, while it runs').props('aria-label="Note"').bind_visibility_from(state, 'running')

        with ui.element('section').classes('box box-list'):
            ui.label('Shopping').classes('h2')

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

            ui.checkbox('Show done', on_change=set_show_done)
            shopping()

        with ui.element('section').classes('box box-one'):
            ui.label('Log in or sign up').classes('h2')
            email = ui.input(placeholder='Your email').props('aria-label="Email"')

            def switch():
                state['joining'] = not state['joining']
                email.props(f'placeholder="{"Work email" if state["joining"] else "Your email"}"')

            ui.button(on_click=switch).bind_text_from(
                state, 'joining', backward=lambda j: 'I have an account' if j else "I'm new here")


ui.run(host='127.0.0.1', port=int(os.environ.get('PORT', 8162)), reload=False, show=False, title='NiceGUI')
