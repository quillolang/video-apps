match ss.status:
    case "loading":
        st.markdown("*Loading…*")
    case "error":
        st.markdown("**Couldn't load**")
    case _:
        st.markdown("3 messages")
