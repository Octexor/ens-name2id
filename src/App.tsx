import * as React from "react"
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  Textarea,
  Heading,
  HStack,
  Button,
  ButtonGroup,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
  Alert,
  AlertIcon,
  Container,
} from "@chakra-ui/react"
import theme from "./theme";
import { ChevronDownIcon } from "@chakra-ui/icons"
import ReactJson from 'react-json-view'
import exportFromJSON from 'export-from-json'
import writeXlsxFile from 'write-excel-file'
import getTokenId, {normalize} from "./helpers/name2id";
import parseInput from "./helpers/parse-input";

interface Name2IdMap {
  [index: string]: string;
}
type ExportTypes = keyof typeof exportFromJSON.types;
const xlsSchema = [
  {
    column: 'Name',
    type: String,
    value: (obj: Name2IdMap) => obj.name
  },
  {
    column: 'Token ID',
    type: String,
    value: (obj: Name2IdMap) => obj.tokenId
  }
]

export const App = () => {

  let [input, setInput] = React.useState('');
  let [result, setResult] = React.useState({} as Name2IdMap);
  let [displayResult, setDisplayResult] = React.useState({} as Name2IdMap);
  let [invalidNames, setInvalidNames] = React.useState([] as string[]);
  let [totalCount, setTotalCount] = React.useState(0);
  let [isId2Name, setIsId2Name] = React.useState(false);
  let [refresh, setRefresh] = React.useState(false);
  const exportTypes = [{name:'CSV', val: 'csv'}, {name:'XLS', val: 'xls'}];
  const maxRendered = 500;
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };
  const handleExport = (type: ExportTypes) => {
    let keys;
    if(isId2Name) {
      keys = Object.keys(result).sort((a, b) => (result[a].localeCompare(result[b])));
    } else {
      keys = Object.keys(result).sort();
    }
    if(type === "json") {
      exportFromJSON({
        data: result,
        fileName: `ens-name-tokenIds-${Date.now()}`,
        exportType: exportFromJSON.types[type],
        replacer: keys
      });
    } else {
      const dataArray: {name: string, tokenId: string}[] = [];
        if(isId2Name) {
          keys.forEach(id => {
            dataArray.push({tokenId: id, name: result[id]});
          });
        } else {
          keys.forEach(name => {
            dataArray.push({name, tokenId: result[name]});
        });
      }
      if(type === 'xls') {
        writeXlsxFile(dataArray, {
          schema: isId2Name ? xlsSchema.reverse() : xlsSchema,
          fileName: `ens-name-tokenIds-${Date.now()}.xlsx`
        }).catch(console.error);
      } else {
        exportFromJSON({
          data: dataArray,
          fileName: `ens-name-tokenIds-${Date.now()}`,
          exportType: exportFromJSON.types[type]
        });
      }
    }
  };

  const generate = (id2name?: boolean) => {
    const map: Name2IdMap = {};
    const displayMap: Name2IdMap = {};
    let count = 0;
    const names = parseInput(input);
    const invalids: string[] = [];
    setIsId2Name(!!id2name);
    names.forEach(name => {
      if(name.length === 0) return;
      let normal;
      try {
        normal = normalize(name);
        let tokenId = getTokenId(normal);
        if(id2name) {
          map[tokenId] = name;
        } else {
          map[name] = tokenId;
        }
        count++;
        if(count <= maxRendered) {
          if(id2name) {
            displayMap[tokenId] = map[tokenId];
          } else {
            displayMap[name] = map[name];
          }
        }
      } catch(e) {
        invalids.push(name);
      }
    });
    setDisplayResult(displayMap)
    setInvalidNames(invalids);
    setResult(map);
    setTotalCount(count);
    return map;
  };

  const clear = () => {
    setInput("");
    setRefresh(true);
  }

  const removeInvalids = () => {
    const r = generate();
    setInput(Object.keys(r).join(' '));
  }

  React.useEffect(() => {
    if(refresh) {
      generate();
      setRefresh(false);
    }
  }, [refresh])

  return (
    <ChakraProvider theme={theme}>
      <Box display="flex" flexDirection="column" textAlign="center" fontSize="xl" minH="100vh" justifyContent="space-between">
        <Grid p={3}>
          <VStack spacing={2} maxW="xl" w="full" marginX="auto">
            <Heading size="lg">ENS Name to ID</Heading>
            <VStack spacing={1} w="full">
              <Text fontSize="md">
                List of ENS names separated by <Code>,</Code> <Code>space</Code> or <Code>new line</Code>
              </Text>
              <Textarea id="input" h="40" value={input} onChange={handleChange}></Textarea>
            </VStack>
            <HStack>
              <ButtonGroup isAttached>
                <Button onClick={() => generate(false)}>Generate Mapping</Button>
                <Menu>
                  <MenuButton as={Button} paddingInlineStart="0" paddingInlineEnd="2" minW="5" rightIcon={<ChevronDownIcon />}></MenuButton>
                  <MenuList minW="7rem" fontSize="md">
                    <MenuItem onClick={() => generate(true)}>ID to Name</MenuItem>
                  </MenuList>
                </Menu>
              </ButtonGroup>
              <ButtonGroup isAttached>
                <Button onClick={clear}>Clear</Button>
                <Menu>
                  <MenuButton as={Button} paddingInlineStart="0" paddingInlineEnd="2" minW="5" rightIcon={<ChevronDownIcon />}></MenuButton>
                  <MenuList minW="7rem" fontSize="md">
                    <MenuItem onClick={removeInvalids}>Remove Invalids</MenuItem>
                  </MenuList>
                </Menu>
              </ButtonGroup>
              <ButtonGroup isAttached>
                <Button onClick={() => handleExport('json')} >Download JSON</Button>
                <Menu>
                  <MenuButton as={Button} paddingInlineStart="0" paddingInlineEnd="2" minW="5" rightIcon={<ChevronDownIcon />}></MenuButton>
                  <MenuList minW="7rem" fontSize="md">
                    {exportTypes.map(item => (
                      <MenuItem value={item.val} onClick={() => handleExport(item.val as ExportTypes)} key={item.val}>{item.name}</MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </ButtonGroup>
              
            </HStack>
            {invalidNames.length > 0 && <Stack spacing={1} fontSize="md">
              {invalidNames.slice(0, 5).map(name => (
              <Alert status='error' borderRadius="10" py="2">
                <AlertIcon />
                Invalid name: {name}
              </Alert>
              ))}
              {invalidNames.length > 5 && <Alert status='error' borderRadius="10" py="2">
                  <AlertIcon />
                  {invalidNames.length - 5} more invalid name{invalidNames.length > 6 ? 's' : ''}!
                </Alert>
              }
            </Stack>
            }
            {totalCount > 0 && <VStack spacing={1} w="full">
              { totalCount > maxRendered && <Text fontSize="md">
                {totalCount} valid names. First {maxRendered} shown below:
              </Text>
              }
              <Box textAlign="left" fontSize="md" maxW="xl" maxH="xl" overflowY="auto" w="full">
                <ReactJson
                  src={displayResult}
                  theme="solarized"
                  name={false}
                  displayDataTypes={false}
                  collapseStringsAfterLength={30}
                  sortKeys={true}
                  style={{
                    padding: "5px",
                    borderRadius: "5px",
                    wordBreak: "break-all"
                  }}
                  ></ReactJson>
              </Box>
            </VStack>
            }
          </VStack>
        </Grid>
        <Box
      bg={'gray.900'}
      color={'gray.200'}>
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction='row'
        spacing={4}
        justify='center'
        align='center'>
        <Text fontSize="md">Built by <Link color="teal.500" href="https://twitter.com/Octexor" target="_blank">@Octexor</Link></Text>
      </Container>
    </Box>
      </Box>
    </ChakraProvider>
  );
};
