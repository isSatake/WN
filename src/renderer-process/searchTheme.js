import { cyan500 } from "material-ui/styles/colors"

export default {
  container: {
    flex: "1 1",
    padding: "11 10 0 430"
  },
  input: {
    width: "100%",
    backgroundColor: cyan500,
    color: "#FFF",
    padding: 10,
    fontFamily: 'Helvetica, sans-serif',
    fontWeight: 300,
    fontSize: 17,
    border: "none",
    borderBottom: '1px solid #FFF',
    outline: "none"
  },
  suggestionsContainerOpen: {
    display: 'block',
    position: 'absolute',
    top: 52,
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
