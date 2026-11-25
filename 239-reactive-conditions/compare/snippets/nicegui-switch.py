def email():
    if state['joining']:
        ui.input(placeholder='Work email').props('aria-label="Work email"')
    else:
        ui.input(placeholder='Your email').props('aria-label="Your email"')
