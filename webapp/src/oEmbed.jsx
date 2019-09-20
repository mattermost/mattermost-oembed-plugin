import React, {Component} from 'react';

import {id as pluginId} from './manifest';
import {getDimensionsForProvider, getOEmbedUrl, getProviderForUrl} from './utils';

export default class OEmbed extends Component {
    constructor(props) {
        super(props);

        // eslint-disable-next-line react/prop-types
        this.oembedUrl = getOEmbedUrl(this.props.embed.url);
        const provider = getProviderForUrl(this.props.embed.url);
        this.dimensions = getDimensionsForProvider(provider.provider_name);
        this.state = {
            html: null,
            thumbnailUrl: null,
        };
    }

    async componentWillMount() {
        try {
            const res = await (await fetch(`/plugins/${pluginId}/`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: this.oembedUrl,
            })).json();

            if (res.html) {
                this.setState({html: res.html});
            } else {
                this.setState({thumbnailUrl: res.thumbnail_url});
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);
        }
    }

    render() {
        const {html, thumbnailUrl} = this.state;
        const style = {
            width: `${this.dimensions.width}px`,
            height: `${this.dimensions.height}px`
        }

        let inner
        if (html) {
            inner = <div dangerouslySetInnerHTML={{__html: html}}/>;
        }

        if (thumbnailUrl) {
            inner = <img src={thumbnailUrl}/>;
        }

        return (
            <div style={style}>
              {inner}
            </div>
        );
    }
}
