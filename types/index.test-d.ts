import { expectType } from "tsd";
import { path, version } from ".";

expectType<string>(path);
expectType<string>(version);
