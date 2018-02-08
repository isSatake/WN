export default {
  container: {
    flexBasis: "80%",
    paddingRight: 30
  },
  input: {
    width: "100%",
    height: "100%",
    padding: 10,
    fontFamily: 'Helvetica, sans-serif',
    fontWeight: 300,
    fontSize: 17,
    border: '1px solid #aaa',
    borderRadius: 3,
    outline: "none"
  },
  suggestionsContainerOpen: {
    display: 'block',
    position: 'absolute',
    top: 80,
    width: "auto",
    height: 300,
    border: '1px solid #aaa',
    backgroundColor: '#fff',
    fontFamily: 'Helvetica, sans-serif',
    fontWeight: 300,
    fontSize: 16,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    zIndex: 2,
    overflowY: "auto"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  suggestion: {
    cursor: 'pointer',
    padding: '10px 20px'
  },
  suggestionHighlighted: {
    backgroundColor: '#ddd'
  }
}
