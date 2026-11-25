if ss.unread == 0:
    st.markdown("All read")
elif ss.unread == 1:
    st.markdown("1 new message")
else:
    st.markdown(f"**{ss.unread} new messages**")
