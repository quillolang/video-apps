email = ui.input(placeholder='Your email').props('aria-label="Email"')

def switch():
    state['joining'] = not state['joining']
    email.props(f'placeholder="{"Work email" if state["joining"] else "Your email"}"')
