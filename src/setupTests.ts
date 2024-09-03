// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Some hacky workarounds missing things in jest https://stackoverflow.com/a/68468204
import { TextEncoder, TextDecoder } from "util";
import { ReadableStream } from "stream/web";

Object.assign(global, { TextDecoder, TextEncoder, ReadableStream });
