import { parseText, ParseError } from '@/parser/text-parser';
import { parseToplevel } from './parser/toplevel-parser';

const content = `use "chat";

def global: string;

def start() {
  write("Hello! What is your name?");
  def name = read();;
}

def sin(x: number): number {
  return x / 2;
}
`;

export default function App() {
  const click = () => {
    const tokenList = parseText(content);
    const toplevelList = parseToplevel(tokenList);
    console.log(tokenList);
    console.log(toplevelList);
  };
  return <button onClick={click}>Hello!</button>;
}
